import { v2 as cloudinary } from "cloudinary";

console.log("cloud_name", process.env.CLOUD_NAME);
console.log("api_key", process.env.API_KEY);
console.log("api_secret", process.env.API_SECRET);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;

// CLOUD_NAME=qoosim
// API_KEY=825939732582576
// API_SECRET=VGSqOCooKsuJZTVZNHxFQ9EPGiU
// UPLOAD_PRESET=qoosim_ayinde

// export const useFileUploadMutation = () => {
//     const [progress, setProgress] = useState<number>(0);
//     const mutation = useMutation({
//       mutationFn: (file: File) =>
//         fileUpload(file, (percent) => setProgress(percent)),
//       onSuccess: (data) => {
//         alertNotification(`File uploaded successfully`, 'success');
//         setProgress(0);
//       },
//       onError: (error) => {
//         alertNotification(`Error: ${(error as Error).message}`, 'error');
//         setProgress(0); // Reset progress
//       },
//     });

//     return {
//         ...mutation,
//         progress,
//       };
// }

// export const fileUpload = async (
//   file: File,
//   onProgress: (progress: number) => void
// ): Promise<{ secure_url: string }> => {
//   const formData = new FormData();
//   formData.append('file', file);

// const response = await axios.post('/api/upload', formData, {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
//   onUploadProgress: (progressEvent) => {
//     const percentCompleted = Math.round(
//       (progressEvent.loaded * 100) / (progressEvent.total || 1)
//     );
//     onProgress(percentCompleted);
//   },
// });

// return response.data;
// };

// // How to to use
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       if(!file) return;
//       // Use the uploadFile mutation
//       mutate(file, {
//        onSuccess(data) {

//          updatedDocs[index].url = data.secure_url;
//          updatedDocs[index].isUploading = false;
//          updatedDocs[index].uploadProgress = 100;

//        },
//        onError(error) {
//          alertNotification('Error uploading file:', "error");
//          updatedDocs[index].isUploading = false;
//          updatedDocs[index].uploadProgress = 0;
//          setPddDocuments([...updatedDocs]);
//        }
//       });
//     } catch (error) {
//       console.error('Error preparing file upload:', error);
//       updatedDocs[index].isUploading = false;
//       updatedDocs[index].uploadProgress = 0;
//       setPddDocuments([...updatedDocs]);
//     }
//   };
