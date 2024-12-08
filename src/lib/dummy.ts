export const dummyMessages = [
    {
      id: 1,
      inbox_id: 1,
      sender_id: 2, // Assume `2` is the recipient
      text: 'Hey there! How are you?',
      created_at: new Date('2024-12-04 14:28:24.195505'),
    },
    {
      id: 2,
      inbox_id: 1,
      sender_id: 1, // Assume `1` is the current user
      text: "I'm good, thanks! What about you?",
      created_at: new Date('2024-12-05T10:01:00'),
    },
    {
      id: 3,
      inbox_id: 1,
      sender_id: 2,
      text: "I'm doing well. Have you finished the project?",
      created_at: new Date('2024-12-06T10:02:00'),
    },
  ];