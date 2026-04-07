import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface Caregiver {
  name: string;
  email: string;
  specialties: string;
  experience_years: number;
  availability: string;
  average_rating: number;
}

export default function HomeScreen() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://<your-backend-ip>:3000/api/public/caregivers')
      .then(res => {
        setCaregivers(res.data.caregivers);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch caregivers:', err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Caregivers</Text>
      <FlatList
        data={caregivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Specialties: {item.specialties}</Text>
            <Text>Experience: {item.experience_years} years</Text>
            <Text>Availability: {item.availability}</Text>
            <Text>Rating: {item.average_rating} ⭐</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
});
