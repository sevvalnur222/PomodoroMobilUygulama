import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import uuid from 'react-native-uuid';
import CategoryPicker from "../../components/CategoryPicker";
import { useTimer } from "../../hooks/useTimer";
import { saveSession } from "../../src/storage/sessionStorage";


export default function HomeScreen() {
  const [minutes, setMinutes] = useState(1); // Varsayılan 1 dakika
  const { seconds, running, start, pause, reset, distractions } = useTimer(minutes * 60);
  const [category, setCategory] = useState<string | null>(null);
  
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };


useEffect(() => {
  // Koşul: Timer durdu VE en az 1 saniye çalışmış olmalı
  if (!running && seconds !== minutes * 60) {
    const workedSeconds = minutes * 60 - seconds;  

    const session = {
      id: String(uuid.v4()),
      date: new Date().toISOString().split("T")[0],
      duration: workedSeconds, 
      category: category || "Kategori Yok",
      distractions: distractions || 0,
    };

    saveSession(session);
    console.log("SEANS KAYDEDİLDİ:", session);
  }
}, [running]);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        paddingTop: 40,
      }}
    >
      
      <CategoryPicker selected={category} onChange={setCategory} />

<Text style={{ fontSize: 18, fontWeight: "600", marginTop: 20 }}>
  Süre Seç (Dakika)
</Text>

<TextInput
  style={{
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#0A1A4F",
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 15,
    fontSize: 18,
  }}
  placeholder="Dakika girin"
  keyboardType="numeric"
  value={minutes.toString()}
  onChangeText={(t) => setMinutes(Number(t))}
/>

      {/* ZAMANLAYICI */}
      <Text
        style={{
          fontSize: 48,
          marginBottom: 30,
          color: "#0a163cff",  // Lacivert
          fontWeight: "bold",
        }}
      >
        {formatTime(seconds)}
      </Text>

      {/* BUTONLAR */}
      {!running ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#0a163cff", // Modern lacivert
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 8,
            marginBottom: 10,
          }}
          onPress={start}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            BAŞLAT
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: "#0a163cff",
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 8,
            marginBottom: 10,
          }}
          onPress={pause}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            DURAKLAT
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#0a163cff", // Bir ton açık lacivert
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 8,
        }}
        onPress={reset}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          SIFIRLA
        </Text>
      </TouchableOpacity>
    </View>
  );
}
