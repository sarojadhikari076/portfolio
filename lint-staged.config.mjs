export default {
  '*.{ts,tsx,js,mjs,cjs}': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{css,md,mdx,json,yml,yaml}': ['prettier --write'],
};
