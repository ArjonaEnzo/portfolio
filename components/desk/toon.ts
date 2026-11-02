import * as THREE from "three";

/**
 * Two-tone "illustration" shading after Abeto's Messenger: each surface keeps
 * its base color where it is lit, and in shadow it uses the same color a
 * little darker and shifted in hue (HSV value × 0.5, hue − 0.02), with a crisp
 * cut between both instead of a smooth gradient. Patched into the existing
 * MeshStandardMaterials with onBeforeCompile, so lights, shadows, maps and
 * emissive keep working. Also hosts an optional wind sway for plants.
 */

/** Shared uniforms: the mood blend writes the tints, a frame hook the time. */
export const toonUniforms = {
  uShadowTint: { value: new THREE.Color(1, 1, 1) },
  uLitTint: { value: new THREE.Color(1, 1, 1) },
  uTime: { value: 0 },
  uWindAmp: { value: 0.03 },
};

export type ToonOptions = {
  /** Light level where the shadow tone turns into the lit tone (smoothstep range). */
  cut?: [number, number];
  /** Wind sway: height (object space) where the sway is full; 0 = no wind. */
  wind?: number;
  /** Skip this object (screens, glowing things). */
  off?: boolean;
};

const HEAD = /* glsl */ `
uniform vec2 uCut;
uniform vec3 uShadowTint;
uniform vec3 uLitTint;
vec3 toonRgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 1e-10)), d / (q.x + 1e-10), q.x);
}
vec3 toonHsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(1.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}
`;

const BODY = /* glsl */ `
{
  vec3 toonBase = diffuseColor.rgb;
  // Light that reached this pixel (directional + lanterns, already shadowed).
  vec3 toonIrr = reflectedLight.directDiffuse / max(toonBase * RECIPROCAL_PI, vec3(1e-4));
  float toonLum = dot(toonIrr, vec3(0.3333));
  vec3 toonHue = toonIrr / max(toonLum, 1e-4);
  float toonCut = smoothstep(uCut.x, uCut.y, toonLum);
  vec3 toonHsv = toonRgb2hsv(toonBase);
  toonHsv.x = fract(toonHsv.x - 0.02);
  toonHsv.z *= 0.5;
  vec3 toonShadow = toonHsv2rgb(toonHsv) * uShadowTint;
  // Lit tone: the base color, warmed or cooled a little by the light's color.
  vec3 toonLit = toonBase * mix(vec3(1.0), toonHue, 0.35) * uLitTint;
  // Strong light (a lantern close by) lifts the lit tone: warm pools with an edge.
  toonLit *= 1.0 + 0.35 * smoothstep(1.2, 3.0, toonLum);
  outgoingLight = mix(toonShadow, toonLit, toonCut)
    + reflectedLight.indirectDiffuse * 0.35
    + totalEmissiveRadiance;
}
`;

const DEFAULT_CUT: [number, number] = [0.2, 0.4];

export function toonify(material: THREE.Material, options: ToonOptions = {}) {
  const mat = material as THREE.MeshStandardMaterial;
  if (!mat.isMeshStandardMaterial || mat.userData.toon) return;
  mat.userData.toon = true;
  // Cut and wind height are per-material uniforms, not constants in the GLSL:
  // every toon material shares one program (two with wind), instead of one
  // program per cut/height combination. Fewer programs = less to compile.
  const cut = { value: new THREE.Vector2(...(options.cut ?? DEFAULT_CUT)) };
  const wind = options.wind ?? 0;
  const windHeight = { value: wind };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uCut = cut;
    shader.uniforms.uShadowTint = toonUniforms.uShadowTint;
    shader.uniforms.uLitTint = toonUniforms.uLitTint;
    shader.fragmentShader = HEAD + shader.fragmentShader.replace("#include <opaque_fragment>", BODY + "\n#include <opaque_fragment>");
    if (wind > 0) {
      shader.uniforms.uTime = toonUniforms.uTime;
      shader.uniforms.uWindAmp = toonUniforms.uWindAmp;
      shader.uniforms.uWindHeight = windHeight;
      shader.vertexShader =
        "uniform float uTime;\nuniform float uWindAmp;\nuniform float uWindHeight;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          /* glsl */ `#include <begin_vertex>
          {
            // Roots stay still, tips move: two sines at different rates.
            float h = clamp(position.y / uWindHeight, 0.0, 1.0);
            float w = sin(uTime * 1.3 + position.x * 4.0) * 0.5 + sin(uTime * 2.1 + position.z * 3.0) * 0.5;
            transformed.xz += vec2(w, w * 0.6) * uWindAmp * h * h;
          }`
        );
    }
  };
  mat.customProgramCacheKey = () => (wind > 0 ? "toon-wind" : "toon");
  mat.needsUpdate = true;
}

/**
 * Walks a subtree and toonifies every standard material. Options come from
 * `userData.toon` on the object or its nearest ancestor that sets it.
 */
export function toonifyTree(root: THREE.Object3D, inherited: ToonOptions = {}) {
  const own = (root.userData.toon as ToonOptions | undefined) ?? {};
  const opts = { ...inherited, ...own };
  const mesh = root as THREE.Mesh;
  if (mesh.isMesh && !opts.off) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => toonify(m, opts));
  }
  root.children.forEach((c) => toonifyTree(c, opts));
}
