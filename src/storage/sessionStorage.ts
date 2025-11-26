import AsyncStorage from "@react-native-async-storage/async-storage";

export type FocusSession = {
  id: string;
  date: string;      // YYYY-MM-DD
  duration: number;  // saniye
  category: string;
  distractions: number;
};

// tüm seansları çek
export async function getSessions(): Promise<FocusSession[]> {
  const json = await AsyncStorage.getItem("SESSIONS");
  return json ? JSON.parse(json) : [];
}

// yeni seans kaydet
export async function saveSession(session: FocusSession) {
  const sessions = await getSessions();
  sessions.push(session);
  await AsyncStorage.setItem("SESSIONS", JSON.stringify(sessions));
}
