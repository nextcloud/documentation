=================
Working with time
=================

You can inject the ``\OCP\AppFramework\Utility\ITimeFactory`` which wraps commonly used time functions for easier testability.

Methods
-------

The factory extends the ``\PSR\Clock\ClockInterface`` with the following methods:

.. code-block:: php

    <?php

	/**
	 * @return int the result of a call to time()
	 * @since 8.0.0
	 */
	public function getTime(): int;

	/**
	 * @param string $time
	 * @param \DateTimeZone|null $timezone
	 * @return \DateTime
	 * @since 15.0.0
	 */
	public function getDateTime(string $time = 'now', \DateTimeZone $timezone = null): \DateTime;

	/**
	 * @param \DateTimeZone $timezone
	 * @return static
	 * @since 26.0.0
	 */
	public function withTimeZone(\DateTimeZone $timezone): static;

	/**
	 * @param string|null $timezone
	 * @return \DateTimeZone Requested timezone if provided, UTC otherwise
	 * @throws \Exception
	 * @since 29.0.0
	 */
	public function getTimeZone(?string $timezone = null): \DateTimeZone;
