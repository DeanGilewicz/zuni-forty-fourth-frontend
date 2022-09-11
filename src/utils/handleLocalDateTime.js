export default function localISOTime(timeToConvert = new Date()) {
  const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(new Date(timeToConvert) - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime;
}
