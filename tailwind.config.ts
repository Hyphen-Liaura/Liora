import flowbitePlugin from 'flowbite/plugin';
import fluid, { extract, fontSize, screens } from 'fluid-tailwind';
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
	darkMode: ['class'],
	content: {
		files: [
			'./src/**/*.{html,js,svelte,ts}',
			'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
		],
		extract
	},
	safelist: ['dark'],
	theme: {
		screens,
		fontSize,
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				// flowbite-svelte
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['JetBrains Mono Variable', ...fontFamily.sans]
			}
		}
	},
	plugins: [flowbitePlugin, fluid]
};

export default config;
