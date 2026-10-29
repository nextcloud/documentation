<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

class EventFinder {

	/**
	 * Parent class for events.
	 */
	private const string EVENT_CLASS = \OCP\EventDispatcher\Event::class;

	/**
	 * The classes below are skipped because they depend on "private" dependencies
	 * and will trigger a fatal error when loading with reflection class.
	 */
	private const array SKIP_CLASSES = [
		\OCP\Diagnostics\IQueryLogger::class,
		\OCP\Files\IRootFolder::class,
		\OCP\Files_FullTextSearch\Model\AFilesDocument::class,
		\OCP\Image::class,
		\OCP\SabrePluginException::class,
		\OCP\Share::class,
		\OCP\Template::class,
	];

	public function __construct(
		private array $classes,
	) {

	}

	/**
	 * @return EventClass[]
	 */
	public function find(): array {
		$docBlockFactory = \phpDocumentor\Reflection\DocBlockFactory::createInstance();

		$result = [];

		foreach ($this->classes as $className => $classPath) {
			if (in_array($className, self::SKIP_CLASSES)) {
				continue;
			}

			try {
				$reflection = new ReflectionClass($className);
			} catch (ReflectionException $e) {
				continue;
			}

			if ($reflection->isAbstract()) {
				continue;
			}

			$isEventClass = false;
			$parentClass = $reflection->getParentClass();

			while ($isEventClass === false && $parentClass !== false) {
				$isEventClass = $parentClass->getName() === self::EVENT_CLASS;
				$parentClass = $parentClass->getParentClass();
			}

			if ($isEventClass === false) {
				continue;
			}

			$docBlock = $docBlockFactory->create($reflection->getDocComment() ?: '/** */');

			$sinceTags = array_map(function (\phpDocumentor\Reflection\DocBlock\Tags\Since $tag) {
				$data = [
					'version' => $tag->getVersion(),
					'description' => '',
				];

				$description = $tag->getDescription();
				if ($description instanceof \phpDocumentor\Reflection\DocBlock\Description) {
					$data['description'] = $description->render();
				}

				return $data;
			}, $docBlock->getTagsByName('since'));

			if ($sinceTags === []) {
				$sinceTags = $this->sinceFromAttributes($reflection);
			}

			$result[] = new EventClass(
				$reflection->getName(),
				$docBlock->getSummary(),
				$docBlock->getDescription()->render(),
				$sinceTags
			);
		}

		usort($result, static function (EventClass $a, EventClass $b) {
			return strcasecmp($a->className, $b->className);
		});

		return $result;
	}

	private function sinceFromAttributes(ReflectionClass $reflection): array {
		$versions = [];
		foreach ([\OCP\AppFramework\Attribute\Listenable::class, \OCP\AppFramework\Attribute\Dispatchable::class] as $attributeClass) {
			foreach ($reflection->getAttributes($attributeClass) as $attribute) {
				$versions[] = $attribute->newInstance()->getSince();
			}
		}

		if ($versions === []) {
			return [];
		}

		usort($versions, 'version_compare');
		return [['version' => $versions[0], 'description' => '']];
	}
}
