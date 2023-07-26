import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMessages, sendMessage } from '../../../../../api/direct_messaging';
import Message from './message';

export default function SingleChat({ user, contact_id }) {
  const [newMessage, setNewMessage] = useState('');

  const messagesQuery = useQuery({
    queryKey: ['messages', user?.id, contact_id], 
    enabled: user?.id != null && contact_id != null,
    queryFn: () => {
      return getMessages({id1: user.id, id2: contact_id/*, limit: 1000*/});
    },
    //refetchInterval: 1000,
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


  const handleSendMessage = () => {
    if (!newMessage) {
      alert('Please write a message.');
      return;
    }
    sendMessageMutation.mutate({ message: newMessage, sender_id: user.id, receiver_id: contact_id, time_sent: new Date(), type: 'text'});
    setNewMessage('');
  };


  const { data: messages, isLoading, isError } = messagesQuery;

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error while fetching messages</>;

  // Sort the messages by time_sent in ascending order
  const sortedMessages = messages.slice().sort((a, b) => new Date(a.time_sent) - new Date(b.time_sent));

  return (
    <div style={{ maxWidth: '90%', margin: '0 auto', display: 'flex', flexDirection: 'column'}}>
      <div style={{ height: '800px', overflowY: 'scroll', border: '1px solid #ccc', display: 'flex', flexDirection: 'column'}}>
      {sortedMessages.map((message) => {
          const isSentByUser = message.sender_id === user.id;
          return <Message key={message.id} message={message} isSentByUser={isSentByUser} />;
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