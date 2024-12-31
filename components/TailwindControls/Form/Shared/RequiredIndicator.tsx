export default function RequiredIndicator({ required }: { required: boolean }) {
  return required ? <span className="font-[900] text-[#a91f1f]">*</span> : null;
}
