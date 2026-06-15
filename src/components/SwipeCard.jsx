import { motion, useMotionValue, useTransform } from "motion/react";

function SwipeCard({ card, onSwipe }) {
  const x = useMotionValue(0);

  const rotate = useTransform(x, [-250, 0, 250], [-16, 0, 16]);
  const acceptOpacity = useTransform(x, [40, 150], [0, 1]);
  const rejectOpacity = useTransform(x, [-150, -40], [1, 0]);

  function handleDragEnd(event, info) {
    const swipeThreshold = 180;
    const velocityThreshold = 800;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe("right");
      return;
    }

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe("left");
      return;
    }
  }

  return (
    <motion.article
      className="match-card swipe-card"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        className="decision-badge accept-badge"
        style={{ opacity: acceptOpacity }}
      >
        Curto
      </motion.div>

      <motion.div
        className="decision-badge reject-badge"
        style={{ opacity: rejectOpacity }}
      >
        Não curto
      </motion.div>

      <p>{card.text}</p>
    </motion.article>
  );
}

export default SwipeCard;
