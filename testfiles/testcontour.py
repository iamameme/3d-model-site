def image_to_outer_curve(image_path, threshold=0.1, pixels_per_unit=100.0):
    from skimage import measure
    from PIL import Image
    import numpy as np
    import matplotlib.pyplot as plt

    # Load image and alpha mask
    img = Image.open(image_path).convert("RGBA")
    alpha = np.array(img)[:, :, 3] / 255.0
    mask = alpha > threshold
    mask = np.pad(mask, pad_width=1, mode='constant', constant_values=False)

    # Find contours
    raw_contours = measure.find_contours(mask, 0.8)
    # Display the image and plot all contours found
    fig, ax = plt.subplots()
    ax.imshow(mask, cmap=plt.cm.gray)

    for contour in raw_contours:
        ax.plot(contour[:, 1], contour[:, 0], linewidth=2)

    ax.axis('image')
    ax.set_xticks([])
    ax.set_yticks([])
    plt.show()


image_to_outer_curve("testfiles/beedrill.jpg")
