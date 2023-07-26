import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMessages, sendMessage } from '../../../../api/dmessages';

export default function SingleChat({ user, contact_id }) {
  const [newMessage, setNewMessage] = useState('');

  const messagesQuery = useQuery({
    queryKey: ['messages', user?.id, contact_id], 
    enabled: user?.id != null && contact_id != null,
    queryFn: () => {
      return getMessages({id1: user.id, id2: contact_id/*, limit: 1000*/});
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message) => sendMessage(message),
    onSuccess: (results) => {
      if (typeof results === 'string') {
        window.alert(results);
      } else {
        messagesQuery.refetch();
      }
    },
    onError: (error) => {
      alert('Unexpected error occurred. Please try again later.');
    },
  });

  function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleSendMessage = () => {
    if (!newMessage) {
      alert('Please write a message.');
      return;
    }
    sendMessageMutation.mutate({ message: newMessage, sender_id: user.id, receiver_id: contact_id, time_sent: getDate() });
    setNewMessage('');
  };


  const { data: messages, isLoading, isError } = messagesQuery;

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error while fetching messages</>;

  // Sort the messages by time_sent in ascending order
  const sortedMessages = messages.slice().sort((a, b) => new Date(a.time_sent) - new Date(b.time_sent));

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc' }}>
        {sortedMessages.map((message) => {
          const isSentByUser = message.sender_id === user.id;
          const senderStyle = isSentByUser
            ? { justifyContent: 'start', backgroundColor: '#007bff', color: '#fff' }
            : { justifyContent: 'end', backgroundColor: '#f0f0f0', color: '#000' };

          return (
            <div
              key={message.id}
              style={{
                padding: '8px',
                borderRadius: '8px',
                marginBottom: '8px',
                maxWidth: '70%',
                ...senderStyle,
              }}
            >
              <div style={{ marginBottom: '4px' }}>{message.message}</div>
              <div style={{ fontSize: '12px', textAlign: 'right' }}>
                {new Date(message.time_sent).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', marginTop: '8px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, marginRight: '8px' }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}