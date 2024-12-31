import { EmailPreview } from "./connectedEmailHelpers";

export const handleMailsWithPreferencesPresent = (allMails: EmailPreview[]) => {
  let updatedMails = [...allMails];
  let referencesList: string[] = [];
  updatedMails?.forEach((mail: EmailPreview) =>
    mail?.references?.forEach((reference) => referencesList.push(reference))
  );
  return updatedMails?.filter(
    (updatedMail) => !referencesList?.includes(updatedMail?.messageId)
  );
};
