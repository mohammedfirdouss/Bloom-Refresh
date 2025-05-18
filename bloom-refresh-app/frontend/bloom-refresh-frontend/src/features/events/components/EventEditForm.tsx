import { useState } from 'react';
import { Box, Input, Button, Textarea, Image } from '@chakra-ui/react';

export default function EventEditForm({ event, onSuccess }: { event: any, onSuccess: () => void }) {
  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [date, setDate] = useState(event.date || '');
  const [status, setStatus] = useState(event.status || 'upcoming');
  const [image, setImage] = useState(event.image || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Upload image to S3/Cloudinary if imageFile is set
    // TODO: Call API to update event
    alert('Event updated!');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={4}>
        <label>Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
      </Box>
      <Box mb={4}>
        <label>Description</label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </Box>
      <Box mb={4}>
        <label>Date</label>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </Box>
      <Box mb={4}>
        <label>Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E0', width: '100%' }}>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </Box>
      <Box mb={4}>
        <label>Event Image</label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {image && <Image src={image} alt="Event" boxSize="120px" mt={2} />}
      </Box>
      <Button colorScheme="green" type="submit">Save Changes</Button>
    </form>
  );
} 