import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Button, Modal, Text, TextInput, View } from "react-native";

type Props = {
  selected: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function CategoryPicker({ selected, onChange, disabled }: Props) {
  const [categories, setCategories] = useState([
    { label: "Ders Çalışma", value: "ders" },
    { label: "Kodlama", value: "kodlama" },
    { label: "Proje", value: "proje" },
    { label: "Kitap Okuma", value: "kitap" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;

    const value = newCategory.toLowerCase().replace(/ /g, "-");
    const newItem = { label: newCategory, value };

    setCategories(prev => [...prev, newItem]);
    onChange(value);

    setNewCategory("");
    setModalVisible(false);
  };

  return (
    <View style={{ width: "90%", alignItems: "center", marginBottom: 30 }}>
      
      {/* BAŞLIK */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 15,
          textAlign: "center",
          color: "#0a163cff",
        }}
      >
        Neye odaklanmak istiyorsunuz?
      </Text>

      {/* PICKER KUTUSU */}
      <View
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#0a163cff", // Lacivert çerçeve
          borderRadius: 8,
          backgroundColor: "white",
          opacity: disabled ? 0.5 : 1,
        }}
      >
       <Picker
  enabled={!disabled}
  selectedValue={selected ?? ""}
  onValueChange={(val) => {
    if (disabled) return; // ekstra güvenlik
    if (val === "add_new") setModalVisible(true);
    else onChange(val);
  }}
  style={{ width: "100%" }}
>

          <Picker.Item label="Kategori Seçin" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
          <Picker.Item label="+ Yeni Kategori Ekle" value="add_new" />
        </Picker>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Yeni kategori adı:
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                marginBottom: 15,
                backgroundColor: "white",
              }}
              placeholder="Örn: Spor, Müzik..."
              value={newCategory}
              onChangeText={setNewCategory}
            />

            <Button title="Ekle" onPress={addCategory} color="#0a163cff" />

            <View style={{ marginTop: 10 }}>
              <Button title="İptal" color="#B91C1C" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
