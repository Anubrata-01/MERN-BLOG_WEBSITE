
import { useAtom } from "jotai";
import { darkModeAtom } from "../StoreContainer/store.js"; 

export default function Layout({ children }) {
  const [darkMode] = useAtom(darkModeAtom);

  return (
    <div className={darkMode ? "dark" : ""}>
      {children}
    </div>
  );
}
