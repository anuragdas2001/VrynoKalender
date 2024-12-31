import React from "react";
import { GoogleMap, InfoBox, LoadScript, Marker } from "@react-google-maps/api";
import { Config } from "../../../../../shared/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import { SecureImage } from "../../../../../components/TailwindControls/Form/SecureImage/SecureImage";

type IModuleWiseMapLocation = {
  data: {
    name?: string;
    organisationName?: string;
    phoneNumber?: string;
    lastName?: string;
    firstName?: string;
    id: string;
    imageId?: string;
    email?: string;
  };
  location: {
    lat: number;
    lng: number;
  };
};

type IModuleWiseMapProps = {
  locations: IModuleWiseMapLocation[];
  moduleName: string;
};

const contactOrLead = (
  loc: IModuleWiseMapLocation,
  handleClick: (id: string) => void
) => (
  <div className="bg-white rounded-md text-lg shadow-2xl p-2 text-black flex flex-row items-center">
    <div className="w-20 h-20 rounded-full flex border border-gray-100 overflow-hidden">
      {loc.data.imageId && (
        <SecureImage
          url={`${Config.fileFetchUrl()}${loc.data.imageId}`}
          alt="profile"
          className="object-cover"
        />
      )}
      {!loc.data.imageId && (
        <Image
          src={"/default_image.png"}
          alt="profile"
          height={128}
          width={128}
          quality={100}
        />
      )}
    </div>
    <div className="fle flex-col text-lg pl-2">
      <a
        className="overflow-hidden cursor-pointer text-vryno-green-dark"
        onClick={(e) => {
          e.preventDefault();
          handleClick(loc.data.id);
        }}
      >
        {loc.data.firstName + " " + loc.data.lastName}
      </a>
      <span className="truncate">{loc.data.email}</span>
      <span className="truncate">{loc.data.phoneNumber}</span>
    </div>
  </div>
);

const moduleSpecificComponents: Record<
  string,
  (
    loc: IModuleWiseMapLocation,
    handleClick: (id: string) => void
  ) => JSX.Element
> = {
  Contact: contactOrLead,
  Organisation: (
    loc: IModuleWiseMapLocation,
    handleClick: (id: string) => void
  ) => (
    <div className="bg-white rounded-md text-lg shadow-2xl p-2 text-black flex flex-row items-center">
      <div className="w-20 h-20 rounded-full flex border border-gray-100 overflow-hidden">
        {loc.data.imageId && (
          <SecureImage
            url={`${Config.fileFetchUrl()}${loc.data.imageId}`}
            alt="profile"
            className="object-cover"
          />
        )}
        {!loc.data.imageId && (
          <Image
            src={"/default_image.png"}
            alt="profile"
            height={128}
            width={128}
            quality={100}
          />
        )}
      </div>
      <div className="fle flex-col text-lg pl-2">
        <a
          className="overflow-hidden cursor-pointer text-vryno-green-dark"
          onClick={(e) => {
            e.preventDefault();
            handleClick(loc.data.id);
          }}
        >
          {loc.data.organisationName}
        </a>
        <span className="truncate">{loc.data.email}</span>
        <span className="truncate">{loc.data.phoneNumber}</span>
      </div>
    </div>
  ),
  Lead: contactOrLead,
};

function ModuleWiseMap({ locations, moduleName }: IModuleWiseMapProps) {
  const [openCard, setOpenCard] = React.useState<number | null>(null);
  const router = useRouter();
  const { locale } = router;
  const handleClick = (id: string) => {
    router
      ?.replace(
        `/crm/${moduleName}s/dashboard?id=${id}`,
        `/crm/${moduleName}s/dashboard?id=${id}`,
        { locale }
      )
      .then();
    return;
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAVrexF8MA90l7YPnH87uFIItUQvsUovLA">
      <GoogleMap zoom={2} center={{ lat: 40.866667, lng: 34.566667 }}>
        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={{ lat: loc.location.lat, lng: loc.location.lng }}
            onClick={() => setOpenCard(index)}
          >
            {openCard === index && (
              <InfoBox onCloseClick={() => setOpenCard(null)}>
                {moduleSpecificComponents[moduleName](loc, handleClick)}
              </InfoBox>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
export default React.memo(ModuleWiseMap);
