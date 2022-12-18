// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// @ts-ignore
const lightCodeTheme = require('prism-react-renderer/themes/github');
// @ts-ignore
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Welcome to my site!!',
  tagline: 'Linux is cool',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Ez4cyka',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/docs',
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: '技术文档',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://ez4cyka.com/reference',
            label: '速查表',
            position: 'left',
          },
          {
            href: 'https://ez4cyka.com/nginx/?global.app.lang=zhCN',
            label: 'nginx配置生成器',
            position: 'left',
          },
          
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: '技术文档',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackexchange.com/users/15848769/ez4cyka',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/users/998086701769555968',
              },
            
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ez4cyka',
              },
            ],
          },
        ],
        
        copyright: `Copyright © ${new Date().getFullYear()} 张昱唯 Built with Docusaurus. 沪ICP备2022031720号-1`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),




    
      // ... Your other configurations.
      themes: [
        // ... Your other themes.
        [
          // @ts-ignore
          require.resolve("@easyops-cn/docusaurus-search-local"),
          /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
          // @ts-ignore
          ({
            // ... Your options.
            // `hashed` is recommended as long-term-cache of index file is possible.
            hashed: true,
            // For Docs using Chinese, The `language` is recommended to set to:
            // ```
            // language: ["en", "zh"],
            // ```
          }),
        ],
      ],
    

};








module.exports = config;
