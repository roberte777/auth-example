import { AuthProvider } from "./hooks/useAuth";
import Director from "./Pages/Director";
function App() {
  return (
    <AuthProvider>
      <Director />
    </AuthProvider>
  );
}

export default App;
