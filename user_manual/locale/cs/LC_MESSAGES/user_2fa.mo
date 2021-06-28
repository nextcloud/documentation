��          �               �    �  %   �            I   $  �   n  �     )   �     �  �   �  +  {  /   �  �   �     �    �  8   �	     �	  4   �	  h   '
  _  �
     �  �   �  D   �  R   *  I   }  4   �  %  �  
  "  '   -     U     i  L   �  �   �  �   w  5   &     \  �   |  4    @   O  �   �     <  ,  P  C   }  -   �  @   �  �   0  �  �    �  )  �  6   �  R   �  I   O  4   �   After you have logged out and need to log in again, you will see a request to enter the TOTP code in your browser. If you enable not only the TOTP factor but another one, you will see a selection screen on which you can choose two-factor method for this login. Select TOTP: Configuring two-factor authentication Considerations FIDO U2F based: If the code was correct you will be redirected to your Nextcloud account. If you use WebAuthn to login to your Nextcloud be sure to not use the same token for 2FA. As this would mean you are again only using a single factor. In your Personal Settings look up the Second-factor Auth setting. In this example this is TOTP, a Google Authenticator compatible time-based code: Logging in with two-factor authentication Now, just enter your code: Once a two-factor authentication app has been enabled by your administrator you can enable and configure it in :doc:`userpreferences`. Below you can see how. Once you have enabled 2FA, your clients will no longer be able to connect with just your password unless they also have support for two-factor authentication. To solve this, you should generate device specific passwords for them. See :doc:`session_management` for more information on how to do this. Recovery codes in case you lost your 2nd factor Since the code is time-based, it’s important that your server’s and your smartphone’s clock are almost in sync. A time drift of a few seconds won’t be a problem. TOTP based: Two-factor authentication (2FA) is a way to protect your Nextcloud account against unauthorized access. It works by requiring two different 'proofs' of your identity. For example, *something you know* (like a password) and *something you have* like a physical key. Typically, the first factor is a password like you already have and the second can be a text message you receive or a code you generate on your phone or another device (*something you have*). Nextcloud supports a variety of 2nd factors and more can be added. Using client applications with two-factor authentication Using two-factor authentication Using two-factor authentication with hardware tokens You can use two-factor authentication based on hardware tokens. The following devices are known to work: You should always generate backup codes for 2FA. If your 2nd factor device gets stolen or is not working, you will be able to use one of these codes to unlock your account. It effectively functions as a backup 2nd factor. To get the backup codes, go to your Personal Settings and look under Second-factor Auth settings. Choose *Generate backup codes*: You should put these codes in a safe spot, somewhere you can find them. Don't put them together with your 2nd factor like your mobile phone but make sure that if you lose one, you still have the other. Keeping them at home is probably the best thing to do. You will see your secret and a QR code which can be scanned by the TOTP app on your phone (or another device). Depending on the app or tool, type in the code or scan the QR and your device will show a login code which changes every 30 seconds. You will then be presented with a list of one-time-use backup codes: `Nitrokey FIDO U2F <https://shop.nitrokey.com/shop/product/nitrokey-fido-u2f-20>`_ `Nitrokey Pro <https://shop.nitrokey.com/shop/product/nitrokey-pro-2-3>`_ `Nitrokey Storage <https://shop.nitrokey.com/shop>`_ Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2021-05-11 11:55+0000
PO-Revision-Date: 2019-11-07 20:28+0000
Last-Translator: Pavel Borecki <pavel.borecki@gmail.com>, 2021
Language: cs
Language-Team: Czech (https://www.transifex.com/nextcloud/teams/64236/cs/)
Plural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 Poté, co jste se odhlásili a potřebujete se znovu přihlásit, uvidíte v prohlížeči žádost o zadání TOTP kódu. Pokud jste zapnuli více možností TOTP faktoru, uvidíte obrazovku s výběrem metody druhého faktoru pro toto přihlášení. Vyberte TOTP: Nastavení dvoufázového ověřování Věci ke zvážení Založené na FIDO U2F: Pokud byl kód správný, budete přesměrování na váš Nextcloud účet. Pokud pro přihlašování k Nextcloud používáte WebAuthn, určitě nepoužívejte stejný token pro 2FA. To by znamenalo, že znovu používáte pouze jeden faktor. V Osobních nastaveních se podívejte do Ověřování druhým faktorem. V tomto příkladu se jedná o TOTP, kód založený na čase, kompatibilní s Google Authenticator: Přihlašování se s dvoufázovým ověřováním se Nyní stačí zadat váš kód: Poté, co správce zapnul aplikaci pro dvoufaktorové ověřování, je možné ji zapnout a nastavit v :doc:`userpreferences`. Níže můžete spatřit jak. Jakmile zapnete 2FA, vámi používaní klienti se nebudou moci připojit, pokud také nepodporují dvoufaktorové ověřování. Toto je možné řešit vytvořením hesel pro jednotlivá zařízení a použit je pro ně. Další informace o tom, jak to udělat, naleznete v sekci :doc:`session_management`. Záložní kódy pro případ, že ztratíte svůj druhý faktor Protože kód je založený na čase, je důležité, aby váš server a mobilní zařízení měly správný čas. Časový rozdíl několik sekund ovšem není problém. Založené na TOTP: Dvoufaktorové ověřování (2FA) je způsob, jak chránit váš Nexcloud účet proti neoprávněnému přístupu. Funguje pomocí vyžadování dvou různých „důkazů“ vaší totožnosti. Například, *něco, co znáte* (jako heslo) a *něco, co máte* jako fyzický klíč. Typicky, prvním faktorem je heslo, které už máte a druhým může být textová zpráva, kterou obdržíte nebo kód, vytvořený na vašem telefonu či jiném zařízení (*něco, co máte*). Nextcloud podporuje rozličné druhé faktory a další je možné přidat. Používání klientských aplikací s dvoufázovým ověřováním Používání dvoufázového ověřování se Použití dvoufázového ověřování se s hardwarovými tokeny Je možné použít dvoufázové ověřování se založená na hardwarových tokenech. Vyzkoušená jsou následující zařízení: Vždy byste si měli nechat vytvořit záložní kódy pro 2FA. Pokud se stane, že o zařízení, sloužící pro druhý faktor přijdete (ztráta, porucha), budete moci odemknout svůj uživatelský účet pomocí jednoho z těchto kódů. Ve výsledku to funguje jako záložní druhý faktor. Pro získání záložních kódů jděte do Osobních nastavení a podívejte se pod nastavení Ověřování druhým faktorem. Zvolte *Vytvořit záložní kódy*: Tyto kódy byste měli uložit na bezpečné místo, ale někam, kde je najdete. Neuchovávejte je pohromadě s druhým faktorem, jako mobilní telefon. Ale zajistěte, že pokud ztratíte jedno, stále ještě budete mít druhé. Uchovávat je doma je nejspíš to nejlepší. Uvidíte své tajemství a QR kód, který je možné naskenovat z TOTP aplikace na vašem telefonu (či jiném zařízení). V závislosti na použití aplikaci či nástroji, zadejte kód nebo naskenujte QR a vaše zařízení zobrazí přihlašovací kód, který se mění každých 30 sekund. Obdržíte seznam jednorázových záložních kódů: `Nitrokey FIDO U2F <https://shop.nitrokey.com/shop/product/nitrokey-fido-u2f-20>`_ `Nitrokey Pro <https://shop.nitrokey.com/shop/product/nitrokey-pro-2-3>`_ `Nitrokey Storage <https://shop.nitrokey.com/shop>`_ 