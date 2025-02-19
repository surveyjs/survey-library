export const surveyThemes: { [index: string]: any } = {};
export function registerDefaultTheme(themeName: string, theme: any) {
    surveyThemes[themeName] = theme;
}
