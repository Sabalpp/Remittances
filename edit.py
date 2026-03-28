import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace springConfig
content = content.replace(
    'const springConfig = { stiffness: 180, damping: 24, mass: 1 }',
    'const springConfig = { type: "spring", stiffness: 350, damping: 30, mass: 1, bounce: 0 }'
)
content = content.replace(
    'const staggerConfig = { staggerChildren: 0.08, delayChildren: 0.1 }',
    'const staggerConfig = { staggerChildren: 0.08, delayChildren: 0.05 }'
)

# Replace Colors
content = content.replace('#F59E0B', '#9FE870')
content = content.replace('#FBBF24', '#B2EA8A')

# Update layout classes and elements for smoothness
# Change <main id="main-content" ... to <motion.main layout id="main-content" ...
content = content.replace(
    '<main id="main-content" role="main" className="max-w-3xl mx-auto px-6 py-32 space-y-16 relative z-10">',
    '<motion.main layout id="main-content" role="main" className="max-w-3xl mx-auto px-6 py-32 space-y-16 relative z-10">'
)
content = content.replace('</main>', '</motion.main>')

# Add layout to form
content = content.replace(
    '<motion.form \n          onSubmit={handleSubmit} ',
    '<motion.form \n          layout\n          onSubmit={handleSubmit} '
)

# Add layout to sections
content = content.replace(
    '<motion.section \n              aria-label="Agent status" ',
    '<motion.section \n              layout\n              aria-label="Agent status" '
)
content = content.replace(
    '<motion.section \n              ref={resultRef} \n              aria-label="Risk assessment" ',
    '<motion.section \n              layout\n              ref={resultRef} \n              aria-label="Risk assessment" '
)
content = content.replace(
    '<motion.section \n              aria-label="Detailed analysis" ',
    '<motion.section \n              layout\n              aria-label="Detailed analysis" '
)

# Add layout to agent divs
content = content.replace(
    '<motion.div \n                    key={id} \n                    className="machined-glass rounded-xl px-4 py-4 relative overflow-hidden group cursor-default"',
    '<motion.div \n                    layout\n                    key={id} \n                    className="machined-glass rounded-2xl px-4 py-4 relative overflow-hidden group cursor-default"'
)

# Improve button rounding
content = content.replace(
    'className="relative w-full py-5 rounded-xl bg-gradient-to-r from-[#9FE870]',
    'className="relative w-full py-5 rounded-full bg-[#9FE870]'
)

# Remove background-black from wrap
content = content.replace(
    'className="min-h-screen bg-black text-white relative"',
    'className="min-h-screen bg-[#111317] text-white relative"'
)



with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated App.jsx successfully.")
