import { defineNuxtModule, createResolver, addPlugin, addComponent, addImportsSources } from '@nuxt/kit'
import NaiveUI from 'naive-ui'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxtjs-naive-ui',
    configKey: 'naive-ui',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    _nuxt.options.nitro.plugins = _nuxt.options.nitro.plugins || []

    // Setup transpile
    const transpile = process.env.NODE_ENV === 'production' ? ['naive-ui'] : []
    if (!_nuxt.options.build.transpile) {
      _nuxt.options.build.transpile = transpile
    }
    else {
      _nuxt.options.build.transpile
        = _nuxt.options.build.transpile.concat(transpile)
    }

    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    // auto import
    const naiveUIExports = Object.keys(NaiveUI)
    const naiveUIComponents = naiveUIExports.filter(name => name.startsWith('N'))
    const naiveUIComposables = naiveUIExports.filter(name => name.startsWith('use'))
    naiveUIComponents.map((component) => {
      addComponent({
        name: component,
        export: component,
        filePath: 'naive-ui',
      })
    })
    addImportsSources({
      from: 'naive-ui',
      imports: naiveUIComposables,
    })
  },
})
