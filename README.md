# Scanly
Group project for Coventry University module 206CDE

## <u>Contributing</u>
1) Clone repo
2) Install pnpm with npm -g install pnpm
3) Install packages with pnpm install
4) Copy .env.template to .env and fill in values (if needed)  
5) Develop!

### Guide to testing and deployment:
- During development, the bot can simply be run with pnpm start
- To test js files after transpiling from ts, run pnpm run start:jsdev
- To transpile for deployment, run pnpm run build:prod
- To lint, run pnpm run lint -- to have it autofix some bits, run pnpm run lint:fix
