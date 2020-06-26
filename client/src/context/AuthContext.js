import { createContext } from "react";
// пустая функция чисто для того, чтобы задать тип определенным частям контекста
function noop () {}

// Задаем дефолтный контекст
export const AuthContext = createContext({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})