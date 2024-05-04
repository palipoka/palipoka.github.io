import executor from "./executors.js";

export default [
  {
    name: ["search", "s"],
    description: "Поиск в Google",
    execute: executor.search,
  },
  {
    name: ["ls"],
    description: "Лист доступных сокращений",
    execute: executor.ls,
  },
  {
    name: ["help"],
    description: "Лист доступных команд",
    execute: executor.help,
  },
  {
    name: ["clear", "cls"],
    description: "Очистить историю ввода",
    execute: executor.clear,
  },
  {
    name: ["weather"],
    description: "Выводит погоду",
    execute: executor.weather,
  },
  {
    name: ["motd"],
    description: "Выводит случайную цитату",
    execute: executor.motd,
  },
];
