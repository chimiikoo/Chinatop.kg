import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram as InstagramIcon, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, type Language } from "@/lib/i18n";

interface InstagramProps {
    language: Language;
}

export function Instagram({ language }: InstagramProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    return (
        <section id="instagram" className="py-24 relative overflow-hidden bg-white dark:bg-gray-950">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-100/50 dark:bg-orange-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 px-4">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-pink-200 dark:border-pink-900/30 text-pink-600 dark:text-pink-400 font-medium mb-6"
                    >
                        <InstagramIcon className="w-5 h-5" />
                        <span>@chinatop.kg</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 dark:text-white mb-6"
                    >
                        {t("instagram.title", language)}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-8"
                    >
                        {t("instagram.subtitle", language)}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Button
                            onClick={() => window.open("https://www.instagram.com/chinatop.kg", "_blank")}
                            className="gradient-orange text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-xl hover-scale flex items-center gap-2"
                        >
                            <ExternalLink className="w-5 h-5" />
                            {t("instagram.follow", language)}
                        </Button>
                    </motion.div>
                </div>

                {/* Video Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    <div
                        className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-900 group cursor-pointer"
                        onClick={togglePlay}
                    >
                        {/* The actual video tag */}
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            poster="/images/oblojka.png"
                            controls={isPlaying}
                            playsInline
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                        >
                            <source src="/videos/presentation1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Overlay if not playing */}
                        <AnimatePresence>
                            {!isPlaying && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-10"
                                >
                                    <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform shadow-2xl">
                                        <Play className="w-10 h-10 text-white fill-white ml-1" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent">
                                        <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                                            {t("instagram.video_title", language)}
                                        </h3>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Reels Section */}
                <div className="mt-16 max-w-5xl mx-auto overflow-hidden">
                    {/* Desktop Grid (Hidden on mobile) */}
                    <div className="hidden md:grid grid-cols-4 gap-6">
                        {[
                            { src: "/images/arzan.png", alt: "Arzan" },
                            { src: "/images/begovoi (1).png", alt: "Begovoi" },
                            { src: "/images/massagka (1).png", alt: "Massagka" },
                            { src: "/images/pinguin.png", alt: "Pinguin" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                className="aspect-[9/16] rounded-2xl overflow-hidden shadow-lg hover-scale cursor-pointer relative group bg-gray-100 dark:bg-gray-900"
                                onClick={() => window.open(`https://www.instagram.com/chinatop.kg`, "_blank")}
                            >
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                                        <Play className="w-4 h-4 fill-white" />
                                        <span>Watch Reel</span>
                                    </div>
                                </div>
                                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/30">
                                    <InstagramIcon className="w-4 h-4 text-white" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Infinite Carousel (Visible only on mobile) */}
                    <div className="md:hidden relative">
                        <motion.div
                            className="flex gap-4 w-max"
                            animate={{
                                x: ["0%", "-50%"]
                            }}
                            transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        >
                            {/* Double the items for seamless loop */}
                            {[
                                { src: "/images/arzan.png", alt: "Arzan" },
                                { src: "/images/begovoi (1).png", alt: "Begovoi" },
                                { src: "/images/massagka (1).png", alt: "Massagka" },
                                { src: "/images/pinguin.png", alt: "Pinguin" },
                                { src: "/images/arzan.png", alt: "Arzan" },
                                { src: "/images/begovoi (1).png", alt: "Begovoi" },
                                { src: "/images/massagka (1).png", alt: "Massagka" },
                                { src: "/images/pinguin.png", alt: "Pinguin" }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="w-[200px] aspect-[9/16] rounded-xl overflow-hidden shadow-md relative shrink-0"
                                    onClick={() => window.open(`https://www.instagram.com/chinatop.kg`, "_blank")}
                                >
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-md p-1 rounded-md">
                                        <InstagramIcon className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                        {/* Gradient Fades for carousel edges */}
                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
