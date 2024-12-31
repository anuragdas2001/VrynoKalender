import slugify from "slugify";

export function subdomainSlugify(value: string) {
  // a subdomain validation has to be implemented
  // https://stackoverflow.com/questions/7930751/regexp-for-subdomain/7933253#:~:text=Each%20subdomain%20part%20must%20have,or%20end%20with%20a%20hyphen.
  // [A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?

  return slugify(
    value.split(" ").length === 1
      ? value
          .replace(/[&\/\\#, @_+()$~%.'":*?<>{}]/g, "-")
          .substring(0, 10)
          .toLowerCase()
      : value
          .replace(/[&\/\\#, @_+()$~%.'":*?<>{}]/g, "-")
          .split(" ")[0]
          .substring(0, 5)
          .toLowerCase()
          .concat("-" + value.replace(".", "-").split(" ")[1].substring(0, 4))
          .toLowerCase(),
    "-"
  );
}
