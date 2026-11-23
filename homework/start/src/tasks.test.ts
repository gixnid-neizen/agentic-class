
import { describe, expect, it } from "vitest"
import { createTask, visibleTasks, seedTasks, renameTask, openCount } from "./tasks"


// Два теста, с которыми поставляется стартер. Они проходят и не покрывают
// поведение, описанное в ISSUE-7.md.
describe("базовая доска", () => {
    it("создаёт задачу и обрезает название", () => {
        const task = createTask(9, "  Купить хлеб  ")
        expect(task?.title).toBe("Купить хлеб")
    })

    it("фильтрует готовые задачи", () => {
        expect(visibleTasks(seedTasks, "done").map((task) => task.id)).toEqual([2])
    })
})


describe("переименование задач", () => {

    it("переименование в пробелы отклоняется", () => {
        const oldName = seedTasks.find((task) => task.id === 1)?.title
        const result = renameTask(seedTasks, 1, "   ")
        const newName = result.find((task) => task.id === 1)?.title
        expect(newName).toBe(oldName)
    })

    it("переименование в табуляцию отклоняется", () => {
        const oldName = seedTasks.find((task) => task.id === 1)?.title
        const result = renameTask(seedTasks, 1, "\t")
        const newName = result.find((task) => task.id === 1)?.title
        expect(newName).toBe(oldName)
    })

    it("переименование в неразрывный пробел отклоняется", () => {
        const oldName = seedTasks.find((task) => task.id === 1)?.title
        const result = renameTask(seedTasks, 1, "\u00A0")
        const newName = result.find((task) => task.id === 1)?.title
        expect(newName).toBe(oldName)
    })

    it("переименование с пробелами обрезается", () => {
        const oldName = seedTasks.find((task) => task.id === 1)?.title
        const result = renameTask(seedTasks, 1, "   " + oldName + "  ")
        const newName = result.find((task) => task.id === 1)?.title
        expect(newName).toBe(oldName)
    })

    it("переименование на пустую строку отклоняется", () => {
        const oldName = seedTasks.find((task) => task.id === 1)?.title
        const result = renameTask(seedTasks, 1, "")
        const newName = result.find((task) => task.id === 1)?.title
        expect(newName).toBe(oldName)
    })
})


describe("пустые задачи", () => {
    it("вкладка «Все» не показывает пустую задачу", () => {
        const ids = visibleTasks(seedTasks, "all").map((task) => task.id)
        expect(ids).toEqual([1, 2])
    })
    it("вкладка «Открытые» не показывает пустую задачу", () => {
        const ids = visibleTasks(seedTasks, "open").map((task) => task.id)
        expect(ids).toEqual([1])
    })
    it("вкладка «Готовые» не показывает пустую задачу", () => {
        const ids = visibleTasks(seedTasks, "done").map((task) => task.id)
        expect(ids).toEqual([2])
    })
})


describe("счётчик", () => {
    it("считает только задачи с видимым названием", () => {
        expect(openCount(seedTasks)).toBe(1)
    })
})

describe("создание задачи", () => {
    it("пустое название не создаёт задачу", () => {
        expect(createTask(9, "   ")).toBeUndefined()
    })

    it("создание обрезает пробелы по краям", () => {
        expect(createTask(9, "  Хлеб  ")?.title).toBe("Хлеб")
    })
})