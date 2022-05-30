const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
     plugins: [
         ...(
           process.env.HUGO_ENVIRONMENT === 'production' ?
           [
             purgecss({
               content: ['./**/*.html']
             })
           ] : []
         )
     ]
 };
