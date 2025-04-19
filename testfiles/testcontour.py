def image_to_outer_curve(image_path, threshold=0.1, pixels_per_unit=100.0):
    from skimage import measure, morphology
    from PIL import Image
    import numpy as np
    import matplotlib.pyplot as plt
    from scipy.ndimage import binary_opening, binary_closing
    from skimage.measure import label, regionprops

      # Now run find_contours on cleaned mask
    def contour_length(contour):
        # Sum of Euclidean distances between consecutive points
        return np.sum(np.sqrt(np.sum(np.diff(contour, axis=0)**2, axis=1)))

    # Load image and alpha mask
    img = Image.open(image_path).convert("RGBA")
    print(img.width)
    alpha = np.array(img)[:, :, 3] / 255.0
    mask = alpha > 0.15
    mask = np.pad(mask, pad_width=1, mode='constant', constant_values=False)

        
    # Find contours
    raw_contours = measure.find_contours(mask, .9, "low")
    raw_contours = [
        c for c in raw_contours if contour_length(c) >= 1000
    ]
    for contour in raw_contours:
        print(contour_length(contour))
    
    # Display the image and plot all contours found
    fig, ax = plt.subplots()
    ax.imshow(mask, cmap=plt.cm.gray)

    for contour in raw_contours:
        ax.plot(contour[:, 1], contour[:, 0], linewidth=2)

    ax.axis('image')
    ax.set_xticks([])
    ax.set_yticks([])
    plt.show()


image_to_outer_curve("riotstevie.png")
