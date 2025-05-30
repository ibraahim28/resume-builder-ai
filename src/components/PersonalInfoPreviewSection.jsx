import { BorderStyles } from "@/app/(main)/editor/_components/BorderStyleButton";
import { useResumeStore } from "@/stores/useResumeStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const PersonalInfoPreviewSection = ({ personalInfo, appearance }) => {
  const { resumes, currentResumeId } = useResumeStore();
  
  // If props are not provided, fall back to the Zustand store
  const personalInfoData = personalInfo || (resumes[currentResumeId]?.personalInfo || {});
  const appearanceData = appearance || (resumes[currentResumeId]?.appearance || {});

  const {
    photo = null,
    firstName = "",
    lastName = "",
    jobTitle = "",
    city = "",
    country = "",
    phone = "",
    email = "",
  } = personalInfoData;

  const { colorHex = "", borderStyle = "" } = appearanceData;

  const [photoSrc, setPhotoSrc] = useState("");

  useEffect(() => {
    if (!photo) {
      setPhotoSrc("");
      return;
    }

    if (photo instanceof File) {
      const objectUrl = URL.createObjectURL(photo);
      setPhotoSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof photo === "string") {
      setPhotoSrc(photo);
    }
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Authors photo"
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "999px"
                  : "10px",
          }}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p
            style={{
              color: colorHex,
            }}
            className="text-3xl font-bold"
          >
            {firstName} {lastName}
          </p>
          <p
            className="font-medium"
            style={{
              color: colorHex,
            }}
          >
            {" "}
            {jobTitle}{" "}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoPreviewSection;
