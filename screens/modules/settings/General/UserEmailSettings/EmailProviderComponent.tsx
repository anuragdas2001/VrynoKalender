/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import { usePlatformContext } from "./shared/UserEmailSettingsContext";
import { Platform } from "./shared/UserEmailSettingsConstants";

const EmailConfigurationInfo = () => {
  return (
    <div className="">
      <h2 className="text-lg px-4">Email Integration</h2>
      <div className="bg-white p-4 rounded-md">
        <ul className="text-sm text-slate-600 mx-5">
          <li>
            Connect your email mailbox with Vryno CRM and transform the way you
            do sales
          </li>
          <li>Send and receive mails from inside CRM records</li>
          <li>Synchronize your email inbox with Vryno CRM</li>
          <li>
            When you click on either of the buttons below we will take you to a
            Google/Microsoft authorization page where you will have to login and
            authorize{" "}
            <Link href="https://www.vryno.com" legacyBehavior>
              <a
                target="_blank"
                className="text-vryno-theme-light-blue underline"
              >
                Vryno
              </a>
            </Link>{" "}
            to be able to fetch emails and store them inside this instance.
            These emails then will be visible to you on your respective modules
            details page which contain one or more email addresses field.
          </li>
          <li>
            This integration will allow you to see emails sent to a particular
            email address without leaving your CRM. You can access more details
            about the app on our website{" "}
            <Link href="https://www.vryno.com" legacyBehavior>
              <a
                target="_blank"
                className="text-vryno-theme-light-blue underline"
              >
                Vryno
              </a>
            </Link>{" "}
            , and check our{" "}
            <Link href="https://vryno.com/privacypolicy/" legacyBehavior>
              <a
                target="_blank"
                className="text-vryno-theme-light-blue underline"
              >
                privacy policy
              </a>
            </Link>{" "}
            for more details.
          </li>
        </ul>
      </div>
    </div>
  );
};

const Provider = ({ platform }: { platform: Platform }) => {
  return (
    <Link href={platform.authCodeRequestUri} legacyBehavior passHref>
      <a className="col-span-1 border border-gray-300 rounded-lg h-32 bg-white flex flex-col items-center justify-center">
        <img src={platform.logo} alt={platform.service} />
        {platform.service}
      </a>
    </Link>
  );
};

const EmailProviderContainer = () => {
  const { platforms } = usePlatformContext();
  const subDomain = window.location.hostname.split(".")[0];
  return (
    <div>
      <EmailConfigurationInfo />
      <div className="flex flex-col mt-4 gap-y-2">
        <hr
          data-testid={"Popular Email Services"}
          className="hr-blackText bg-transparent text-black mb-2"
          data-content={`Popular Email Services`}
          style={{ color: "black" }}
        />
        {
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-x-6">
            {platforms.map((platform: Platform) => {
              return (
                <Provider
                  key={platform.platform}
                  platform={platform}
                ></Provider>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
};

export default EmailProviderContainer;
