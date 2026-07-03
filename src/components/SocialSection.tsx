import { useState } from "react";
import { motion } from "motion/react";
import { Heart, MessageCircle, Instagram, Facebook, Youtube, Linkedin, Send, Radio } from "lucide-react";
import { SocialPost } from "../types";

interface SocialSectionProps {
  posts: SocialPost[];
}

export default function SocialSection({ posts }: SocialSectionProps) {
  const [activePlatform, setActivePlatform] = useState<string>("Todos");

  const platforms = [
    { name: "Todos", icon: Radio },
    { name: "Instagram", icon: Instagram },
    { name: "LinkedIn", icon: Linkedin },
    { name: "Facebook", icon: Facebook },
    { name: "YouTube", icon: Youtube }
  ];

  const filteredPosts = activePlatform === "Todos"
    ? posts
    : posts.filter(p => p.platform.toLowerCase() === activePlatform.toLowerCase());

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-transparent transition-colors relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Social & Estrategia
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-5">
            Presencia Social e Impacto Orgánico
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full mb-5"></div>
          <p className="text-gray-600 dark:text-gray-300 font-light text-base">
            No solo programamos webs, creamos la narrativa completa de tu marca. Diseñamos publicaciones disruptivas basadas en datos que posicionan tu empresa en la mente del consumidor.
          </p>
        </div>

        {/* Platform Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {platforms.map((plat) => {
            const IconComponent = plat.icon;
            return (
              <button
                key={plat.name}
                onClick={() => setActivePlatform(plat.name)}
                className={`px-5 py-3 rounded-xl flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                  activePlatform === plat.name
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-primary/40 dark:hover:border-secondary/40"
                }`}
              >
                <IconComponent size={14} />
                <span>{plat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mock Publication Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
            >
              
              {/* Card Header (Profile simulation) */}
              <div className="p-4 flex items-center justify-between bg-white dark:bg-[#051a1b]/60 border-b border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  {/* Fake Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold">
                    JU
                  </div>
                  <div>
                    <span className="font-heading font-extrabold text-xs text-black dark:text-white block leading-none">
                      joseurdaneta.ok
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono mt-0.5 block">
                      {post.platform} Post
                    </span>
                  </div>
                </div>

                {/* Micro Platform Indicator */}
                <span className="text-gray-400">
                  {post.platform === "Instagram" && <Instagram size={14} className="text-pink-500" />}
                  {post.platform === "LinkedIn" && <Linkedin size={14} className="text-blue-500" />}
                  {post.platform === "Facebook" && <Facebook size={14} className="text-blue-600" />}
                  {post.platform === "YouTube" && <Youtube size={14} className="text-red-500" />}
                </span>
              </div>

              {/* Card Image */}
              <div className="aspect-square relative overflow-hidden group">
                <img
                  src={post.image}
                  alt="Post content"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Hover Like Overlay display */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-semibold">
                  <span className="flex items-center gap-1.5"><Heart size={18} fill="currentColor" /> {post.likes}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle size={18} fill="currentColor" /> {post.comments}</span>
                </div>
              </div>

              {/* Card Caption details */}
              <div className="p-5 space-y-4 bg-white dark:bg-[#051a1b]/60 border-t dark:border-white/5">
                
                {/* Simulated Like/Comment Icons bar */}
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-300">
                  <div className="flex items-center gap-4">
                    <button className="hover:text-red-500 transition-colors flex items-center gap-1">
                      <Heart size={16} />
                      <span className="text-xs font-mono">{post.likes}</span>
                    </button>
                    <button className="hover:text-primary transition-colors flex items-center gap-1">
                      <MessageCircle size={16} />
                      <span className="text-xs font-mono">{post.comments}</span>
                    </button>
                  </div>
                  <Send size={15} className="hover:text-primary cursor-pointer" />
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                  <span className="font-bold mr-1 text-black dark:text-white">joseurdaneta.ok</span>
                  {post.caption}
                </p>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
