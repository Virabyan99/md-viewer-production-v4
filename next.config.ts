// next.config.ts
const withNextIntl = require('next-intl/plugin')(); // No path needed for i18n/request.ts

module.exports = withNextIntl({
  typescript: {
    ignoreBuildErrors: true,
  },
});