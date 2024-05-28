import "./App.css";
import { AuthProvider } from "./providers/auth/AuthProvider";
import HomePage from "./page/Home";
import { ToastProvider } from "./providers/toast/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
