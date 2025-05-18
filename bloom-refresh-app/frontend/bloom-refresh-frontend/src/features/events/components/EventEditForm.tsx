import { useState } from 'react';
import { Box, Input, Button, Textarea, Image } from '@chakra-ui/react';

async function uploadImageToS3(file: File): Promise<string> {
  // 1. Get presigned URL from your backend
  const res = await fetch('/api/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  });
  const { uploadUrl, fileUrl } = await res.json();

  // 2. Upload file directly to S3
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error('S3 upload failed');
  // 3. Return the S3 file URL
  return fileUrl;
}

export default function EventEditForm({ event, onSuccess }: { event: any, onSuccess: () => void }) {
  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [date, setDate] = useState(event.date || '');
  const [status, setStatus] = useState(event.status || 'upcoming');
  const [image, setImage] = useState(event.image || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = image;
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImageToS3(imageFile);
      } catch (err) {
        alert('Image upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    // TODO: Call API to update event with imageUrl
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
      <Button colorScheme="green" type="submit" loading={uploading}>Save Changes</Button>
    </form>
  );
} 