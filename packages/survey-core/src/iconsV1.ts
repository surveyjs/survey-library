// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const path = (require as any).context("./images-v1/", true, /\.svg$/);

const icons: { [index: string]: string } = {};
path.keys().forEach((key: string) => {
  icons[key.substring(2, key.length - 4).toLowerCase()] = path(key);
});

export { icons };
