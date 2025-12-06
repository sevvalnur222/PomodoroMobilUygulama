import { useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { FocusSession, getSessions } from "../../src/storage/sessionStorage";

const screenWidth = Dimensions.get("window").width;

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m} dk ${s.toString().padStart(2, "0")} sn`;
}

export default function DashboardScreen() {
  
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getSessions();
      setSessions(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Yükleniyor...</Text>
      </View>
    );
  }

  // --- Son 7 Günlük Veriler ---
const last7Days = [];

for (let i = 6; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);

  const dateStr = date.toISOString().split("T")[0];

  const total = sessions
    .filter((s) => s.date === dateStr)
    .reduce((sum, s) => sum + s.duration, 0);

  last7Days.push({
    label: dateStr.slice(5), // MM-DD
    value: Math.floor(total / 60), // dakika
  });
}
//Bugün toplam süre
const today = new Date().toISOString().split("T")[0];
const todaySessions = sessions.filter((s) => s.date === today);
const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);

//tüm zamanların toplam süresi
const allTimeTotal = sessions.reduce((sum, s) => sum + s.duration, 0);

//toplam dikkat dağınıklığı
const totalDistractions = sessions.reduce(
  (sum, s) => sum + (s.distractions || 0),
  0
);

//pie chart veri hazırlanışı
const categoryMap: Record<string, number> = {};

sessions.forEach((s) => {
  if (!categoryMap[s.category]) {
    categoryMap[s.category] = 0;
  }
  categoryMap[s.category] += s.duration;
});

const colors = [
  "#4c6ef5",
  "#38b000",
  "#ff6b6b",
  "#f59f00",
  "#845ef7",
  "#0ea5e9",
  "#d946ef",
  "#14b8a6",
];

const totalMinutes = Object.values(categoryMap).reduce(
  (sum, val) => sum + val,
  0
);


const pieData = Object.keys(categoryMap).map((key, index) => ({
  name: key,
  population: categoryMap[key] / 60,
  color: colors[index % colors.length],   // ASLA undefined olmaz!
  legendFontColor: "white",
  legendFontSize: 14,
}));


  return (
  <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 20 }}>

      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "#0A1A4F",
          marginBottom: 20,
        }}
      >
        Raporlarım
      </Text>

      {/* Genel İstatistikler */}

      {/* Son 7 Gün Grafik */}
    <View style={{ marginBottom: 30 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
        Son 7 Gün Odaklanma Süreleri (dk)
    </Text>



  <BarChart
  data={{
    labels: last7Days.map((d) => d.label),
    datasets: [{ data: last7Days.map((d) => d.value) }],
  }}
  width={screenWidth - 40}
  height={220}
  fromZero
  yAxisLabel=""
  yAxisSuffix=" dk"
  chartConfig={{
    backgroundGradientFrom: "#1e3a8a",
    backgroundGradientTo: "#1e40af",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.5,
  }}
  style={{
    marginVertical: 8,
    borderRadius: 8,
  }}
/>

<Text
  style={{
    color: "#0A1A4F",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: -12,
    textAlign: "center",
  }}
>
  Kategorilere Göre Odaklanma Dağılımı
</Text>

{pieData.length > 0 && (
  <PieChart
    data={pieData}
    width={600}
    height={220}
    accessor="population"
    hasLegend={false}
    chartConfig={{
      color: () => "#fff",
    }}
    backgroundColor="transparent"
    paddingLeft="0"
  />
)}

<View style={{ marginTop: 10 }}>
      {pieData.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: item.color,
              marginRight: 8,
            }}
          />

          <Text style={{ fontWeight: "600" }}>
              {item.name} — {item.population.toFixed(1)} dk 
             ({((item.population * 60) / totalMinutes * 100).toFixed(1)}%)
          </Text>

        </View>
      ))}
    </View>



</View>

      <View
        style={{
          marginBottom: 20,
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Bugün Toplam Odaklanma Süresi
        </Text>
        <Text>{formatDuration(todayTotal)}</Text>

        <Text
          style={{ fontWeight: "bold", marginTop: 12, marginBottom: 4 }}
        >
          Tüm Zamanların Toplam Odaklanma Süresi
        </Text>
        <Text>{formatDuration(allTimeTotal)}</Text>

        <Text
          style={{ fontWeight: "bold", marginTop: 12, marginBottom: 4 }}
        >
          Toplam Dikkat Dağınıklığı Sayısı
        </Text>
        <Text>{totalDistractions}</Text>
      </View>

      {/* Seans Geçmişi */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
          Seans Geçmişi
        </Text>

        {loading ? (
          <Text>Yükleniyor...</Text>
        ) : sessions.length === 0 ? (
          <Text>Henüz kayıtlı seans yok.</Text>
        ) : (
          <FlatList
            data={[...sessions].reverse()} // son seans en üstte
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontWeight: "600" }}>
                  {item.date} — {item.category}
                </Text>
                <Text>{formatDuration(item.duration)}</Text>
                <Text>Dikkat dağınıklığı: {item.distractions}</Text>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}
