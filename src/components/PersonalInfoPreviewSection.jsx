import Image from "next/image";
import React, { useEffect, useState } from "react";

const PersonalInfoPreviewSection = ({ resumeData }) => {
  const { photo, firstName, lastName, jobtitle, city, country, phone, email } =
    resumeData;

    const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

    useEffect(()=> {
      const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";

      if (objectUrl) setPhotoSrc(onjectUrl);
      if (photo === null) setPhotoSrc("")

        return () => {
          URL.revokeObjectURL(objectUrl);
        }
    }, [photo]);
  return <div className="flex items-center gap-6">
    {photoSrc && (
      <Image src={photoSrc} width={100} height={100} alt="Authors photo" className="aspect-square object-cover" />
    )}
<div className="space-y-2.5">
  <div className="space-y-1">
    <p className="text-3xl font-bold">
      {firstName} {lastName}
    </p>
  </div>
</div>
  </div>;
};

export default PersonalInfoPreviewSection;
