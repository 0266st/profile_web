// Public keys shown in the footer next to GPG. Both are public by design;
// keep any trailing comment (often user@host or an email) off the SSH key.

// Currently the first key GitHub publishes for 0266st (github.com/0266st.keys).
export const SSH_PUBLIC_KEY: string | null =
  "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDoIUd27R+kQwdmWySYVgTTPfIfESoGPW6TjntdWLbscnzjNc3sehgsLOdY4vQED2r9pUGhuS5zmKvzfP2hTWjiqs4wVqf2B/v3xzd2xwLXYGb48enmP3r5ictj3fuUZlvnkw/cIdT50t6Cx8GekHZsa1aBHdlmv1wgLbjaw0sIQXifeeQbzA0xjGzHp4kTkXFS7VpGK7nZLs4K+WGPO0RVg8mNE6Nc+yTx4KcXLcZIeUl5ySOo8R9DegNEpsqKRVKWgNMb8KtX+u0ycOZMIruaUoxUB9PCUJCI6rX/2NdQrOpC7W3fDffcDZRX3/rInXz+JwpgCKMwCS1IJ5KYTtxo08N2VAgczysRGFO/HoBpfjXjzZH47lLzP8snVXV28IpvU6h7LjPF8IUwBlUcLKhSNTzXRHCYCnY5KhW2EmANntk5ohqbMLphZCAfAgJmcgo9kfKptnmqZk5CaHN19P6d9ZV9sJL2/esDdAppaFWInq5zyw8ROxPz0nOrWiGe7k8=";

// Paste the `age1…` recipient from `age-keygen` to publish it. null = not yet.
export const AGE_PUBLIC_KEY: string | null = null;
