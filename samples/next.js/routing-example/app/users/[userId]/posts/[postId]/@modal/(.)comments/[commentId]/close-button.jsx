'use client';

import { useRouter } from 'next/navigation';

export default function CloseButton({ href }) {
  const router = useRouter();

  const handleClose = () => {
    router.push(href);
  };

  return (
    <button className="button" type="button" onClick={handleClose}>
      Close
    </button>
  );
}
