===============
Problèmes connus
===============

BlackBerry OS 10.2
------------------

Les versions de BlackBerry OS au dessus de la 10.2.2102 n'accepte plus le
protocole avec ``https://`` en face d'adresse du serveur. Le programme va
constamment vous dire qu'il ne peut pas se connecter au serveur. Donc, au lieuu d'écrire :

    https://example.com/remote.php/dav/principals/users/USERNAME/

dans le champ d'adresse du serveur, vous pouvez écrire :

    example.com/remote.php/dav/principals/users/USERNAME/
