type HandleProfilePicUploadProps = {
  onUploadStart: () => void;
  onUploadSuccess: (url: string) => void;
  onUploadEnd: () => void;
}

export const handleProfilePicUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  { onUploadStart, onUploadSuccess, onUploadEnd }: HandleProfilePicUploadProps
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  onUploadStart();
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'profile');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      onUploadSuccess(result.data.url);
    } else {
      alert(result.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload image');
  } finally {
    onUploadEnd();
  }
};