// Loaded after hydration by <MotionProvider>, so framer-motion's animation
// code stays out of the first JS chunk. domAnimation is enough: nothing uses
// layout animations.
import { domAnimation } from "framer-motion";

export default domAnimation;
