import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { API } from "../../src/config/api";
import { useRouter } from "expo-router";

interface Caregiver {
  id: string;
  name: string;
  photoUrl: string;
  skills: string[];
  rate: number;
  rating: number;
}

export default function HomeScreen() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const res = await API.get("/caregivers");
        setCaregivers(res.data);
      } catch (err) {
        console.error("Error fetching caregivers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregivers();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <FlatList
      data={caregivers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push({
              pathname: "/caregiver/[id]",
              params: { id: item.id }
      })}

        >
          <Image source={{ uri: item.photoUrl }} style={styles.photo} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.skills.join(", ")}</Text>
            <Text>₹{item.rate}/hr</Text>
            <Text>⭐ {item.rating}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  photo: { width: 80, height: 80, borderRadius: 40 },
  info: { marginLeft: 10, justifyContent: "center" },
  name: { fontSize: 18, fontWeight: "bold" },
});
