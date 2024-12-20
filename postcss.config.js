import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss'

export default {
     plugins: [
         ...(
           process.env.HUGO_ENVIRONMENT === 'production' ?
           [
             purgeCSSPlugin({
               content: ['./**/*.html']
             })
           ] : []
         )
     ]
 };
