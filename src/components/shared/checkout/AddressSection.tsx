/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { useState } from "react";
import AddressLayer from "../../layout/AddressLayer";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface AddressSectionProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export default function AddressSection({
  watch,
  setValue,
}: AddressSectionProps) {
  const [addressLayer, setAddressLayer] = useState(false);
  const address = watch("address");
  const apartmentNumber = watch("apartmentNumber");
  const entrance = watch("entrance");
  const floor = watch("floor");
  const comment = watch("comment");

  return (
    <>
      <div
        className="cursor-pointer flex items-center gap-4 py-2 md:p-6 md:bg-[#F8FAFC] md:hover:bg-[#EAF1F7]"
        onClick={() => setAddressLayer(true)}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-[#EEF2F6] rounded">
          <Image src="/icons/marker.svg" alt="marker" width={20} height={20} />
        </div>

        <div className="flex-1 text-left">
          <div className="text-[14px] font-light text-[#697586]">
            Адрес доставки
          </div>
          <div className="text-[16px] font-normal">
            {" "}
            {address ? address : "Выберите адрес доставки"}
          </div>
        </div>

        <div className="w-6 h-6 flex items-center justify-center">
          <Image
            src="/icons/chevron-right.svg"
            alt=">"
            width={20}
            height={20}
          />
        </div>
      </div>
      <AddressLayer
        open={addressLayer}
        onClose={() => setAddressLayer(false)}
        initialValues={{ address, apartmentNumber, entrance, floor, comment }}
        onSelect={(values) => {
          setValue("address", values.address);
          setValue("apartmentNumber", values.apartmentNumber);
          setValue("entrance", values.entrance);
          setValue("floor", values.floor);
          setValue("comment", values.comment);
          setAddressLayer(false);
        }}
      />
    </>
  );
}
