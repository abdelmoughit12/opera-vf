const MessageModal = ({ type, message, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-300' : 'border-red-300';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-40">
      <div className={`rounded-lg p-6 max-w-sm w-full border ${bgColor} ${borderColor}`}>
        <p className={`text-lg font-medium ${textColor}`}>{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-100 rounded-lg border"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
export default MessageModal;