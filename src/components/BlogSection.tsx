import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Calendar, X, ChevronRight, BookOpen, User } from "lucide-react";
import { BlogPost } from "../types";

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ["Todos", "Innovación", "SEO", "Marketing", "Diseño", "Noticias"];

  const filteredPosts = activeCategory === "Todos"
    ? posts
    : posts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="blog" className="py-24 px-6 bg-white dark:bg-transparent transition-colors relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Blog & Conocimiento
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-5">
            Artículos destacados y Tendencias
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full mb-5"></div>
          <p className="text-gray-600 dark:text-gray-400 font-light text-base">
            Profundizamos en el estado de la tecnología web, metodologías de posicionamiento SEO y estrategias digitales para marcas innovadoras.
          </p>
        </div>

        {/* Categories filters tab */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-gray-50 dark:bg-neutral-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-primary/35 dark:hover:border-secondary/35 hover:shadow-xl transition-all flex flex-col justify-between h-full"
            >
              <div>
                {/* Post Cover Image */}
                <div className="aspect-[1.6] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1.5 rounded bg-primary dark:bg-secondary text-white dark:text-black shadow-md">
                    {post.category}
                  </span>
                </div>

                {/* Post details */}
                <div className="p-6">
                  {/* Date & Read time bar */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-mono mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-black dark:text-white leading-snug mb-3 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card CTA bottom trigger */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-primary dark:text-secondary mt-auto group-hover:translate-x-1.5 transition-transform">
                <span>LEER ARTÍCULO</span>
                <ChevronRight size={14} />
              </div>

            </motion.article>
          ))}
        </div>

        {/* Immersive Article Reader Modal Lightbox */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPost(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              ></motion.div>

              {/* Reader Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-neutral-900 w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-y-auto shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
              >
                {/* Close Trigger */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/35 text-white transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Hero Header */}
                <div className="aspect-[2] w-full relative">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-primary dark:bg-secondary text-white dark:text-black mb-2 inline-block">
                        {selectedPost.category}
                      </span>
                      <h3 className="font-display font-extrabold text-xl sm:text-3xl text-white">
                        {selectedPost.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Article Content Text body */}
                <div className="p-8 sm:p-10 space-y-6">
                  {/* Author / Date Meta Bar */}
                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono pb-4 border-b border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1.5"><User size={12} /> Redactado por Sinergia Agencia Creativa</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {selectedPost.date}</span>
                  </div>

                  {/* Intro quote */}
                  <div className="p-4 border-l-4 border-primary pl-6 italic text-gray-600 dark:text-gray-300 font-sans text-base">
                    “{selectedPost.excerpt}”
                  </div>

                  {/* Post Full Text Content */}
                  <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed font-light whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>

                  <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-8"></div>

                  {/* End signature */}
                  <div className="flex items-center gap-3">
                    <BookOpen size={20} className="text-primary dark:text-secondary" />
                    <span className="text-xs font-mono text-gray-400 uppercase">Sinergia Agencia Creativa • Consulting Insight • All Rights Reserved</span>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
